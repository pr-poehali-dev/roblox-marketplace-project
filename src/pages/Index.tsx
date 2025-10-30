import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const products: Product[] = [
    {
      id: 1,
      name: 'Neon Cyber Sword',
      price: 1299,
      image: 'https://cdn.poehali.dev/projects/5fce56da-840a-4835-836d-08af76360638/files/a93b0361-6347-4374-8dba-a4d2715b9ad2.jpg',
      description: 'Мощный меч с неоновым свечением. Идеален для PvP сражений. Уникальные анимации атак.',
      category: 'Оружие'
    },
    {
      id: 2,
      name: 'Cyber Visor Helmet',
      price: 899,
      image: 'https://cdn.poehali.dev/projects/5fce56da-840a-4835-836d-08af76360638/files/fb1b3ba8-ab9f-42a6-8ac3-d1be4835f665.jpg',
      description: 'Футуристический шлем с голубым визором. Защита +50. Эксклюзивный дизайн.',
      category: 'Броня'
    },
    {
      id: 3,
      name: 'Magic Wings',
      price: 1599,
      image: 'https://cdn.poehali.dev/projects/5fce56da-840a-4835-836d-08af76360638/files/7446c335-9bee-4023-b108-b38f2ec67d27.jpg',
      description: 'Волшебные крылья с эффектом искр. Позволяют летать. Редкий предмет.',
      category: 'Аксессуары'
    },
    {
      id: 4,
      name: 'Dragon Scale Shield',
      price: 1099,
      image: 'https://cdn.poehali.dev/projects/5fce56da-840a-4835-836d-08af76360638/files/a93b0361-6347-4374-8dba-a4d2715b9ad2.jpg',
      description: 'Щит из драконьей чешуи. Блокирует 80% урона. Легендарное качество.',
      category: 'Броня'
    },
    {
      id: 5,
      name: 'Lightning Staff',
      price: 1399,
      image: 'https://cdn.poehali.dev/projects/5fce56da-840a-4835-836d-08af76360638/files/fb1b3ba8-ab9f-42a6-8ac3-d1be4835f665.jpg',
      description: 'Посох молний с мощными заклинаниями. Урон +100. Эпическая редкость.',
      category: 'Оружие'
    },
    {
      id: 6,
      name: 'Rainbow Pet',
      price: 799,
      image: 'https://cdn.poehali.dev/projects/5fce56da-840a-4835-836d-08af76360638/files/7446c335-9bee-4023-b108-b38f2ec67d27.jpg',
      description: 'Питомец с радужным хвостом. Следует за вами. Очень милый.',
      category: 'Питомцы'
    }
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Gamepad2" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RobloxShop
            </h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
                <SheetDescription>
                  {cart.length === 0 ? 'Ваша корзина пуста' : `Товаров: ${getTotalItems()}`}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-8 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Icon name="Minus" size={14} />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Icon name="Plus" size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {cart.length > 0 && (
                  <>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Итого:</span>
                        <span className="text-primary">{getTotalPrice()} ₽</span>
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      <Icon name="CreditCard" className="mr-2" size={20} />
                      Оформить заказ
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h2 className="text-4xl font-bold mb-2">Каталог товаров</h2>
          <p className="text-muted-foreground">Лучшие предметы для вашего персонажа в Roblox</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openProductDetails(product)}
            >
              <div className="relative overflow-hidden bg-muted/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <Badge className="absolute top-3 right-3">{product.category}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {product.name}
                  <span className="text-primary font-bold">{product.price} ₽</span>
                </CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <Icon name="ShoppingCart" className="mr-2" size={18} />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  <Badge className="mt-2">{selectedProduct.category}</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 rounded-lg overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Описание</h3>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Цена</h3>
                    <p className="text-3xl font-bold text-primary">{selectedProduct.price} ₽</p>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setIsDialogOpen(false);
                    }}
                  >
                    <Icon name="ShoppingCart" className="mr-2" size={20} />
                    Добавить в корзину
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="Info" size={18} />
                О магазине
              </h3>
              <p className="text-sm text-muted-foreground">
                RobloxShop - ваш надёжный магазин игровых предметов
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="CreditCard" size={18} />
                Оплата
              </h3>
              <p className="text-sm text-muted-foreground">
                Принимаем все виды оплаты
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="FileText" size={18} />
                Правила
              </h3>
              <p className="text-sm text-muted-foreground">
                Ознакомьтесь с правилами покупки
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Icon name="Headphones" size={18} />
                Поддержка
              </h3>
              <p className="text-sm text-muted-foreground">
                Служба поддержки 24/7
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
