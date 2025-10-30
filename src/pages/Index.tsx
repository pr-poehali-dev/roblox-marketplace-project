import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  amount: number;
  price: number;
  discount?: number;
  seller: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
}

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [robloxUsername, setRobloxUsername] = useState('');

  const products: Product[] = [
    {
      id: 1,
      name: 'Robux',
      amount: 400,
      price: 299,
      seller: 'ProSeller',
      rating: 4.9,
      reviews: 1243,
      deliveryTime: '5-15 минут'
    },
    {
      id: 2,
      name: 'Robux',
      amount: 800,
      price: 549,
      discount: 10,
      seller: 'TopDealer',
      rating: 5.0,
      reviews: 2156,
      deliveryTime: '5-10 минут'
    },
    {
      id: 3,
      name: 'Robux',
      amount: 1700,
      price: 1099,
      discount: 15,
      seller: 'MegaStore',
      rating: 4.8,
      reviews: 987,
      deliveryTime: '10-20 минут'
    },
    {
      id: 4,
      name: 'Robux',
      amount: 4500,
      price: 2699,
      discount: 20,
      seller: 'ProSeller',
      rating: 4.9,
      reviews: 756,
      deliveryTime: '5-15 минут'
    },
    {
      id: 5,
      name: 'Robux',
      amount: 10000,
      price: 5499,
      discount: 25,
      seller: 'TopDealer',
      rating: 5.0,
      reviews: 1432,
      deliveryTime: '5-10 минут'
    },
    {
      id: 6,
      name: 'Robux',
      amount: 22500,
      price: 11999,
      discount: 30,
      seller: 'MegaStore',
      rating: 4.9,
      reviews: 543,
      deliveryTime: '10-15 минут'
    }
  ];

  const getDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return Math.round(price * (1 - discount / 100));
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsCheckoutOpen(true);
  };

  const handlePurchase = () => {
    if (!email || !robloxUsername) {
      alert('Заполните все поля');
      return;
    }
    alert(`Заказ оформлен!\nEmail: ${email}\nRoblox: ${robloxUsername}\nСумма: ${selectedProduct ? getDiscountedPrice(selectedProduct.price, selectedProduct.discount) : 0} ₽\n\nДеньги будут переведены на карту 2200 7005 3598 3257`);
    setIsCheckoutOpen(false);
    setEmail('');
    setRobloxUsername('');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">RoMarket</h1>
                <p className="text-xs text-muted-foreground">Маркетплейс Roblox</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost">
                <Icon name="User" className="mr-2" size={18} />
                Войти
              </Button>
              <Button>
                <Icon name="Store" className="mr-2" size={18} />
                Продать
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4">Купить Robux быстро и безопасно</h2>
            <p className="text-lg text-blue-100 mb-6">
              Лучшие цены на Robux от проверенных продавцов. Моментальная доставка 24/7.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="Shield" size={20} />
                </div>
                <div>
                  <div className="font-semibold">100% безопасно</div>
                  <div className="text-sm text-blue-100">Защита покупателя</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="Zap" size={20} />
                </div>
                <div>
                  <div className="font-semibold">Быстрая доставка</div>
                  <div className="text-sm text-blue-100">От 5 минут</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="Star" size={20} />
                </div>
                <div>
                  <div className="font-semibold">Проверенные продавцы</div>
                  <div className="text-sm text-blue-100">Рейтинг и отзывы</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="robux" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="robux" className="flex items-center gap-2">
              <Icon name="Coins" size={18} />
              Robux
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Icon name="Package" size={18} />
              Игровые предметы
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <Icon name="UserCircle" size={18} />
              Аккаунты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="robux">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">Выберите количество Robux</h3>
              <div className="text-sm text-muted-foreground">
                Найдено предложений: {products.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className="hover:shadow-lg transition-all duration-300 animate-fade-in relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {product.discount && (
                    <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
                      -{product.discount}%
                    </Badge>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src="https://cdn.poehali.dev/projects/5fce56da-840a-4835-836d-08af76360638/files/78db0642-fa3f-4c5d-8a5f-6ee3a0e2057d.jpg"
                        alt="Robux"
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <CardTitle className="text-2xl">{product.amount.toLocaleString()}</CardTitle>
                        <CardDescription>Robux</CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="User" size={14} />
                      <span>{product.seller}</span>
                      <Badge variant="secondary" className="ml-auto">
                        <Icon name="Star" size={12} className="mr-1" />
                        {product.rating}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      {product.discount ? (
                        <>
                          <span className="text-3xl font-bold text-primary">
                            {getDiscountedPrice(product.price, product.discount)} ₽
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            {product.price} ₽
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-primary">
                          {product.price} ₽
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">Доставка: {product.deliveryTime}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Icon name="MessageSquare" size={14} className="text-muted-foreground" />
                      <span className="text-muted-foreground">{product.reviews} отзывов</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handleBuyClick(product)}
                    >
                      <Icon name="ShoppingCart" className="mr-2" size={18} />
                      Купить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="items">
            <div className="text-center py-16">
              <Icon name="Package" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">Скоро появятся игровые предметы</h3>
              <p className="text-muted-foreground">Мы работаем над добавлением новых категорий товаров</p>
            </div>
          </TabsContent>

          <TabsContent value="accounts">
            <div className="text-center py-16">
              <Icon name="UserCircle" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">Скоро появятся аккаунты</h3>
              <p className="text-muted-foreground">Мы работаем над добавлением новых категорий товаров</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <CardTitle>Безопасные платежи</CardTitle>
              <CardDescription>
                Защита покупателя и гарантия возврата средств
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Icon name="Headphones" size={24} className="text-primary" />
              </div>
              <CardTitle>Поддержка 24/7</CardTitle>
              <CardDescription>
                Служба поддержки всегда готова помочь вам
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Icon name="Zap" size={24} className="text-primary" />
              </div>
              <CardTitle>Моментальная доставка</CardTitle>
              <CardDescription>
                Получите Robux в течение 5-15 минут
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
            <DialogDescription>
              Заполните данные для получения товара
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <Alert>
                <Icon name="Info" size={16} />
                <AlertDescription>
                  После оплаты Robux будут доставлены на ваш аккаунт в течение {selectedProduct.deliveryTime}
                </AlertDescription>
              </Alert>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Товар:</span>
                  <span className="font-semibold">{selectedProduct.amount.toLocaleString()} Robux</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Продавец:</span>
                  <span>{selectedProduct.seller}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">
                    {getDiscountedPrice(selectedProduct.price, selectedProduct.discount)} ₽
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">Email для чека</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="roblox">Ник в Roblox</Label>
                  <Input
                    id="roblox"
                    type="text"
                    placeholder="YourRobloxUsername"
                    value={robloxUsername}
                    onChange={(e) => setRobloxUsername(e.target.value)}
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Icon name="CreditCard" size={16} className="text-blue-600" />
                <AlertDescription className="text-blue-900">
                  Комиссия с продажи переводится на карту: 2200 7005 3598 3257
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handlePurchase}>
              <Icon name="CreditCard" className="mr-2" size={18} />
              Оплатить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border mt-16 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="Info" size={18} />
                О платформе
              </h3>
              <p className="text-sm text-muted-foreground">
                RoMarket - надёжный маркетплейс для покупки Robux и игровых товаров Roblox
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Покупателям</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Как купить Robux</li>
                <li>Гарантии безопасности</li>
                <li>Способы оплаты</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Продавцам</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Начать продавать</li>
                <li>Правила продажи</li>
                <li>Комиссии</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Поддержка</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Связаться с нами</li>
                <li>Часто задаваемые вопросы</li>
                <li>Правила сервиса</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>© 2024 RoMarket. Все деньги с комиссии переводятся на карту 2200 7005 3598 3257</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
