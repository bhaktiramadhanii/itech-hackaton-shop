import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedAuth from "./components/protected/ProtectedAuth";
import TambahMenuPage from "./pages/TambahMenuPage";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../src/config/firebase-config";
import DetailPage from "./pages/DetailPage";
import { onAuthStateChanged } from "firebase/auth";
import CheckOutPage from "./pages/CheckOutPage";

function App() {
  // cart
  const [cartItem, setCartItem] = useState([]);
  const onAdd = (product) => {
    const exist = cartItem.find((x) => x.id === product.id);
    if (exist) {
      setCartItem(
        cartItem.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItem([...cartItem, { ...product, qty: 1 }]);
    }
  };
  const onRemove = (product) => {
    const ProductExist = cartItem.find((item) => item.id === product.id);
    if (ProductExist.qty === 1) {
      setCartItem(cartItem.filter((item) => item.id !== product.id));
    } else {
      setCartItem(
        cartItem.map((item) =>
          item.id === product.id
            ? { ...ProductExist, qty: ProductExist.qty - 1 }
            : item
        )
      );
    }
  };

  // auth
  const [user, setUser] = useState({});
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // get data from firebase
  const [products, setProducts] = useState([]);
  const [searchProducts, setSerchProducts] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  useEffect(() => {
    const productsCollectionRef = collection(db, "products");
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProducts();
  }, []);

  console.log(products);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage products={products} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedAuth>
              <DashboardPage
                products={searchTitle.length > 0 ? searchProducts : products}
                setSerchProducts={setSerchProducts}
                setSearchTitle={setSearchTitle}
                user={user}
              />
            </ProtectedAuth>
          }
        />

        <Route
          path="/dashboard/tambah"
          element={
            <ProtectedAuth>
              <TambahMenuPage products={products} user={user} />
            </ProtectedAuth>
          }
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/product/:nama"
          element={
            <DetailPage
              products={products}
              onAdd={onAdd}
              cartItem={cartItem}
              onRemove={onRemove}
              user={user}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <CheckOutPage
              cartItem={cartItem}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          }
        />
        <Route path="*" element={<p>404 page</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
