import HomePage from "../pages/HomePage/HomePage"
import CartPage from "../pages/CartPage/CartPage"
import ProductPage from "../pages/ProductPage/ProductPage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import {TypeProductPage} from "../pages/TypeProductPage/TypeProductPage"
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import AdminPage from "../pages/AdminPage/AdminPage"
import OrderPageUser from "../pages/OrderPage/OrderPageUser"
import ProfilePage from "../pages/Profile/ProfilePage"

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/order',
        page: OrderPageUser,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/cart',
        page: CartPage,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/products',
        page: ProductPage,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
        isShowFotter: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
        isShowFotter: false
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isShowFotter: false,
        isPrivate: true,
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,
        isShowFotter: false
    },
    {
        path: '*',
        page: NotFoundPage
    }
]