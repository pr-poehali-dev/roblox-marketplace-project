import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Seller {
  id: number;
  username: string;
  email: string;
  rating: number;
  total_sales: number;
  card_number: string;
}

interface Order {
  id: number;
  buyer_email: string;
  roblox_username: string;
  amount: number;
  total_price: number;
  commission: number;
  status: string;
  created_at: string;
}

const SellerDashboard = () => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    card_number: ''
  });
  const [productForm, setProductForm] = useState({
    amount: '',
    price: '',
    discount: '',
    delivery_time: '5-15 минут',
    stock: '1'
  });

  useEffect(() => {
    const storedSeller = localStorage.getItem('seller');
    if (storedSeller) {
      const sellerData = JSON.parse(storedSeller);
      setSeller(sellerData);
      loadOrders(sellerData.id);
    }
  }, []);

  const loadOrders = async (sellerId: number) => {
    try {
      const response = await fetch(
        `https://functions.poehali.dev/92f50d56-b8b2-4aac-9ddb-be1832819409?seller_id=${sellerId}`
      );
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/4a45599a-2aee-47f9-8d65-d76e9ede8e5c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...loginForm })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSeller(data.seller);
        localStorage.setItem('seller', JSON.stringify(data.seller));
        setIsLoginOpen(false);
        loadOrders(data.seller.id);
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.seller.username}!`
        });
      } else {
        toast({
          title: 'Ошибка входа',
          description: data.error || 'Неверные данные',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось войти',
        variant: 'destructive'
      });
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/4a45599a-2aee-47f9-8d65-d76e9ede8e5c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...registerForm })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Регистрация успешна',
          description: 'Теперь войдите в систему'
        });
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
      } else {
        toast({
          title: 'Ошибка регистрации',
          description: data.error || 'Попробуйте другие данные',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось зарегистрироваться',
        variant: 'destructive'
      });
    }
  };

  const handleAddProduct = async () => {
    if (!seller) return;

    try {
      const response = await fetch('https://functions.poehali.dev/ede74763-f530-4838-81af-4f5a053a539c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: seller.id,
          product_type: 'Robux',
          amount: parseInt(productForm.amount),
          price: parseFloat(productForm.price),
          discount: parseInt(productForm.discount || '0'),
          delivery_time: productForm.delivery_time,
          stock: parseInt(productForm.stock)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Товар добавлен',
          description: `ID товара: ${data.product_id}`
        });
        setIsAddProductOpen(false);
        setProductForm({
          amount: '',
          price: '',
          discount: '',
          delivery_time: '5-15 минут',
          stock: '1'
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setSeller(null);
    setOrders([]);
    localStorage.removeItem('seller');
    toast({
      title: 'Выход выполнен',
      description: 'До скорой встречи!'
    });
  };

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="Store" className="text-white" size={32} />
            </div>
            <CardTitle className="text-2xl">Панель продавца</CardTitle>
            <CardDescription>
              Начните продавать Robux на RoMarket
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" size="lg" onClick={() => setIsLoginOpen(true)}>
              <Icon name="LogIn" className="mr-2" size={20} />
              Войти
            </Button>
            <Button variant="outline" className="w-full" size="lg" onClick={() => setIsRegisterOpen(true)}>
              <Icon name="UserPlus" className="mr-2" size={20} />
              Регистрация
            </Button>
          </CardContent>
        </Card>

        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вход для продавцов</DialogTitle>
              <DialogDescription>Введите ваши данные для входа</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLoginOpen(false)}>Отмена</Button>
              <Button onClick={handleLogin}>Войти</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Регистрация продавца</DialogTitle>
              <DialogDescription>Создайте аккаунт для продажи товаров</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input
                  id="reg-username"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="reg-password">Пароль</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="reg-card">Номер карты для выплат</Label>
                <Input
                  id="reg-card"
                  placeholder="1234 5678 9012 3456"
                  value={registerForm.card_number}
                  onChange={(e) => setRegisterForm({ ...registerForm, card_number: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRegisterOpen(false)}>Отмена</Button>
              <Button onClick={handleRegister}>Зарегистрироваться</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Store" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Панель продавца</h1>
                <p className="text-sm text-muted-foreground">{seller.username}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <Icon name="LogOut" className="mr-2" size={18} />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Star" size={20} className="text-primary" />
                Рейтинг
              </CardTitle>
              <div className="text-3xl font-bold">{seller.rating.toFixed(1)}</div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ShoppingBag" size={20} className="text-primary" />
                Продаж
              </CardTitle>
              <div className="text-3xl font-bold">{seller.total_sales}</div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="CreditCard" size={20} className="text-primary" />
                Карта выплат
              </CardTitle>
              <div className="text-lg font-mono">{seller.card_number || 'Не указана'}</div>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-6">
          <Button onClick={() => setIsAddProductOpen(true)} size="lg">
            <Icon name="Plus" className="mr-2" size={20} />
            Добавить товар
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Мои заказы</CardTitle>
            <CardDescription>История продаж и активные заказы</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Package" size={48} className="mx-auto mb-2 opacity-50" />
                <p>Заказов пока нет</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{order.amount} Robux</div>
                        <div className="text-sm text-muted-foreground">
                          Покупатель: {order.roblox_username}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{order.total_price} ₽</div>
                        <div className="text-xs text-muted-foreground">
                          Комиссия: {order.commission} ₽
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить товар</DialogTitle>
            <DialogDescription>Создайте новое предложение Robux</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Количество Robux</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1000"
                value={productForm.amount}
                onChange={(e) => setProductForm({ ...productForm, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                placeholder="500"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="discount">Скидка (%)</Label>
              <Input
                id="discount"
                type="number"
                placeholder="0"
                value={productForm.discount}
                onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="delivery">Время доставки</Label>
              <Input
                id="delivery"
                value={productForm.delivery_time}
                onChange={(e) => setProductForm({ ...productForm, delivery_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="stock">Количество в наличии</Label>
              <Input
                id="stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              />
            </div>
            <Alert>
              <Icon name="Info" size={16} />
              <AlertDescription>
                С каждой продажи будет взята комиссия 5% на карту 2200 7005 3598 3257
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>Отмена</Button>
            <Button onClick={handleAddProduct}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerDashboard;
