import { Button, Carousel, Container } from 'react-bootstrap';
import { ICart, ICategory, IUser } from '../../../../@types/';
import { CarouselContainer } from '../CarouselContainer/indext';


import { ToolBar } from '../ToolBar';

import './style.scss';

type HeaderProps = {
    items: ICategory[];
    user?: IUser;
    cart?: ICart;
}
export function Header({
    items,
    user,
    cart
}: HeaderProps) {

    return (

        <header>
            <ToolBar
                categories={items}
                user={user}
                cart={cart} />

            <div className="carousel-container">
                <CarouselContainer />
            </div>
        </header>
    )
}