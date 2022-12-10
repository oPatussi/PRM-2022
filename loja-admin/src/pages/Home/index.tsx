import { IconButton, IContextualMenuProps, IRenderFunction, Persona, PersonaSize, Stack, Text, Tooltip, TooltipHost } from '@fluentui/react';
import { Nav, INavLinkGroup, IRenderGroupHeaderProps } from '@fluentui/react/lib/Nav';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from '../../hook/useAuth';

import { BrandPage } from '../Brand';
import { CategoryPage } from '../Category';
import { CustomerPage } from '../Customer';
import { LoginPage } from '../Login';
import { OrderPage } from '../Order';
import { ProductPage } from '../Product';
import { SalePage } from '../Sale';
import { UserPage } from '../User';

const navLinkGroups: INavLinkGroup[] = [
  {
    name: 'Cadastros',
    links: [
      {
        key: 'category',
        name: 'Categorias',
        icon: 'ProductList',
        url: '/categories',
      },
      {
        key: 'brand',
        name: 'Marcas',
        icon: 'Tag',
        url: '/brands'
      },
      {
        key: 'product',
        name: 'Produtos',
        icon: 'Product',
        url: '/products',
      },
      {
        key: 'customer',
        name: 'Clientes',
        icon: 'People',
        url: '/customers',
      },
    ],
  },
  {
    name: 'Pedidos dos Site',
    links: [
      {
        key: 'order',
        name: 'Pedido a Faturar',
        icon: 'ShoppingCart',
        url: '/orders',
      },
      {
        key: 'sale',
        name: 'Vendas Efetuadas',
        icon: 'ActivateOrders',
        url: '/sales',
      },
    ],
  },
  {
    name: 'Configurações',
    links: [
      {
        key: 'user',
        name: 'Usuários',
        icon: 'Contact',
        url: '/users',
      }
    ],
  },
];

const onRenderGroupHeader = (group: INavLinkGroup): JSX.Element => {
  return <h3>{group.name}</h3>;
}

export function HomePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'logout',
        text: 'Logout',
        iconProps: { iconName: 'SignOut' },
        onClick: handleLogout
      }
    ],
    directionalHintFixed: true,
  };

  function handleLogout() {
    signOut();
    navigate('/');
    window.location.reload();
  }

  return (
    <div id="home-page">
      {user ? (
        <Stack horizontal={false}>
          <Stack horizontal verticalAlign="center" className="header" horizontalAlign="space-between">
            <Text variant="large">
              Administração da Loja
            </Text>
            <TooltipHost content={user.name}>
              <IconButton
                menuProps={menuProps}>
                <Persona text={user.name} size={PersonaSize.size32} hidePersonaDetails  />
              </IconButton>
            </TooltipHost>
            
          </Stack>

          <Stack horizontal className="main-container">
            <Nav groups={navLinkGroups}
              onRenderGroupHeader={onRenderGroupHeader as IRenderFunction<IRenderGroupHeaderProps>} />

            <Routes>
            <Route path="categories" element={<CategoryPage />} />
              <Route path="brands" element={<BrandPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="orders" element={<OrderPage />} />
              <Route path="sales" element={<SalePage />} />
              <Route path="customers" element={<CustomerPage />} />
              <Route path="users" element={<UserPage />} />
            </Routes>
          </Stack>
        </Stack>
      ) : (
        <LoginPage />
      )}
    </div>
  )
}
