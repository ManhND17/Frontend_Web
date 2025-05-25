import HomePage from "../pages/HomePage/HomePage"
import CartPage from "../pages/CartPage/CartPage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import {TypeProductPage} from "../pages/TypeProductPage/TypeProductPage"
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage"
import SignInPage from "../pages/SignInPage/SignInPage"
import SignUpPage from "../pages/SignUpPage/SignUpPage"
import AdminPage from "../pages/AdminPage/AdminPage"
import ProfilePage from "../pages/Profile/ProfilePage"
import PaymentPage from "../pages/PaymentPage/PaymentPage"
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage"
import OrderDetail from '../pages/OrderDetails/OrderDetails'
import Review from '../pages/ReveiwPage/Reveiw'
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess"

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/my-order',
        page: MyOrderPage,
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
        path: '/order-detail',
        page: OrderDetail,
        isShowHeader: true,
        isShowFotter: true
    },
    {
        path: '/review-product',
        page: Review,
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
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        isShowFotter: false
    },
    {
        path: '/payment-result',
        page: PaymentSuccess,
        isShowHeader: true,
        isShowFotter: false
    },
    {
        path: '*',
        page: NotFoundPage
    }
]