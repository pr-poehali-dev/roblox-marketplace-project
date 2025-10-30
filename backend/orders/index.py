'''
Business: API для создания заказов с автоматическим расчётом комиссии
Args: event - dict с httpMethod, body (product_id, buyer_email, roblox_username)
      context - object с request_id
Returns: HTTP response с данными заказа и информацией о комиссии
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            product_id = body_data.get('product_id')
            buyer_email = body_data.get('buyer_email')
            roblox_username = body_data.get('roblox_username')
            
            if not all([product_id, buyer_email, roblox_username]):
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
                SELECT seller_id, amount, price, discount, stock
                FROM products
                WHERE id = %s AND is_active = true
            ''', (product_id,))
            
            product = cur.fetchone()
            
            if not product:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Product not found or inactive'}),
                    'isBase64Encoded': False
                }
            
            seller_id, amount, price, discount, stock = product
            
            if stock < 1:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Product out of stock'}),
                    'isBase64Encoded': False
                }
            
            discounted_price = float(price) * (1 - (discount or 0) / 100)
            commission = discounted_price * 0.05
            commission_card = '2200700535983257'
            
            cur.execute('''
                INSERT INTO orders (product_id, seller_id, buyer_email, roblox_username, amount, total_price, commission, commission_card, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (product_id, seller_id, buyer_email, roblox_username, amount, discounted_price, commission, commission_card, 'pending'))
            
            order_id = cur.fetchone()[0]
            
            cur.execute('''
                UPDATE products
                SET stock = stock - 1
                WHERE id = %s
            ''', (product_id,))
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'order_id': order_id,
                    'total_price': round(discounted_price, 2),
                    'commission': round(commission, 2),
                    'commission_card': commission_card
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            seller_id = params.get('seller_id')
            
            if seller_id:
                cur.execute('''
                    SELECT id, buyer_email, roblox_username, amount, total_price, commission, status, created_at
                    FROM orders
                    WHERE seller_id = %s
                    ORDER BY created_at DESC
                ''', (seller_id,))
            else:
                cur.execute('''
                    SELECT id, buyer_email, roblox_username, amount, total_price, commission, status, created_at
                    FROM orders
                    ORDER BY created_at DESC
                    LIMIT 100
                ''')
            
            rows = cur.fetchall()
            orders = []
            for row in rows:
                orders.append({
                    'id': row[0],
                    'buyer_email': row[1],
                    'roblox_username': row[2],
                    'amount': row[3],
                    'total_price': float(row[4]),
                    'commission': float(row[5]),
                    'status': row[6],
                    'created_at': row[7].isoformat() if row[7] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'orders': orders}),
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
