
import { createContext, ReactNode, useEffect, useState } from "react";
import { ICart } from "../@typesLocal";

type CartContextType = {
    cart: ICart;
    replaceCart(card: ICart): void;
}
export const CartContext = createContext<CartContextType>({} as CartContextType);


type CartContextProviderProp = {
    children: ReactNode;
}
export function CartContextProvider(props: CartContextProviderProp) {
    const [cart, setCart] = useState<ICart>({} as ICart);

    const keyCustomer = '@PRM:loja:customer';
    const keyCart = '@PRM:loja:cart';

    useEffect(() => {

        //Leio o usuário e o carrinho do localStorage        
        const storageCart = localStorage.getItem(keyCart);

        if (storageCart) {
            setCart(JSON.parse(storageCart));
        } else {
            const storageCustomer = localStorage.getItem(keyCustomer);

            if (storageCustomer) {
                const auxCart: IOrder = {
                    customer: JSON.parse(storageCustomer),
                    orderDate: new Date,                    
                    items: []
                }

                //Gravo o cart na session
                localStorage.setItem(keyCart, JSON.stringify(auxCart));

                setCart(auxCart);
            }
        }

    }, []);

    function replaceCart(cart: IOrder) {
        setCart(cart)

        //Gravo o cart na session
        localStorage.setItem(keyCart, JSON.stringify(cart));

    }
    
    return (
        <CartContext.Provider value={{cart, replaceCart}}>
            {props.children}
        </CartContext.Provider>
    )
}