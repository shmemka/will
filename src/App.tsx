import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Support from './pages/Support'
import Catalog from './pages/Catalog'
import TypePage from './pages/TypePage'
import Product from './pages/Product'
import Agencies from './pages/Agencies'
import AgencyPage from './pages/AgencyPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Guide from './pages/Guide'
import Partners from './pages/Partners'
import Legal from './pages/Legal'
import NotFound from './pages/NotFound'
import Account from './pages/account/Account'
import OrderPage from './pages/account/OrderPage'
import PartnerCabinet from './pages/partner/PartnerCabinet'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="soprovozhdenie" element={<Support />} />
        <Route path="katalog" element={<Catalog />} />
        <Route path="katalog/:typeId" element={<TypePage />} />
        <Route path="tovar/:offerId" element={<Product />} />
        <Route path="sluzhby" element={<Agencies />} />
        <Route path="sluzhby/:slug" element={<AgencyPage />} />
        <Route path="korzina" element={<Cart />} />
        <Route path="oformlenie" element={<Checkout />} />
        <Route path="zakaz-prinyat/:id" element={<Success />} />
        <Route path="chto-delat" element={<Guide />} />
        <Route path="partneram" element={<Partners />} />
        <Route path="partner" element={<PartnerCabinet />} />
        <Route path="kabinet" element={<Account />} />
        <Route path="kabinet/:tab" element={<Account />} />
        <Route path="kabinet/zakaz/:id" element={<OrderPage />} />
        <Route path="dokumenty/:doc" element={<Legal />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
