'''
Business: API для управления товарами маркетплейса - получение, добавление, обновление
Args: event - dict с httpMethod, body, queryStringParameters
      context - object с request_id
Returns: HTTP response с списком товаров или результатом операции
'''

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Seller-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute('''
                SELECT p.id, p.product_type, p.amount, p.price, p.discount, 
                       p.delivery_time, p.stock, s.username, s.rating,
                       (SELECT COUNT(*) FROM reviews WHERE seller_id = p.seller_id) as review_count
                FROM products p
                JOIN sellers s ON p.seller_id = s.id
                WHERE p.is_active = true AND p.stock > 0
                ORDER BY p.created_at DESC
            ''')
            
            rows = cur.fetchall()
            products = []
            for row in rows:
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'amount': row[2],
                    'price': float(row[3]),
                    'discount': row[4] or 0,
                    'deliveryTime': row[5],
                    'stock': row[6],
                    'seller': row[7],
                    'rating': float(row[8]) if row[8] else 0,
                    'reviews': row[9]
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'products': products}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            seller_id = body_data.get('seller_id')
            product_type = body_data.get('product_type', 'Robux')
            amount = body_data.get('amount')
            price = body_data.get('price')
            discount = body_data.get('discount', 0)
            delivery_time = body_data.get('delivery_time', '5-15 минут')
            stock = body_data.get('stock', 1)
            
            if not all([seller_id, amount, price]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO products (seller_id, product_type, amount, price, discount, delivery_time, stock)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (seller_id, product_type, amount, price, discount, delivery_time, stock))
            
            product_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'product_id': product_id}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
