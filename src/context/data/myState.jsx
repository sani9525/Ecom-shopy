import React, { useEffect } from 'react'
import MyContext from './myContext';
import { useState } from 'react';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { fireDB } from '../../firebase/FirebaseConfig';


function MyState(props) {

  const [mode, setMode] = useState('light');

    const toggleMode = () => {
        if (mode === 'light') {
             setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = 'white';

        }
    }

  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState({
    title: null,
    price: null,
    imageUrl: null,
    category: null,
    description: null,
    time: Timestamp.now(),
    date: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )

  })


  const addProduct = async () => {
    if (products.title == null || products.price == null || products.imageUrl == null || products.category == null || products.description == null) {
      return toast.error('Please fill all fields')
    }

    setLoading(true)
    try {
      const productRef = collection(fireDB, "products")
      await addDoc(productRef, products)
      toast.success("Product Add successfully")
      setTimeout(() => {
        window.location.href='/dashboard'
      }, 1000);
      getProductData()
      // closeModal()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
    setProducts("")
  }

  const [product, setProduct] = useState([]);

  const getProductData = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(fireDB, "products"),
        orderBy("time"),
        // limit(5)
      );
      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productsArray)
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }




  useEffect(() => {
    getProductData();
  }, []);

  // update products

  const edithandle = (item) => {
    setProducts(item)
  }


  const UpdateProduct = async (item) => {
    setLoading(true)
    try {
      await setDoc(doc(fireDB, "products", products.id), products)
      toast.success("Product Updated successfully")
      getProductData();
      setLoading(false)
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1000);
    } catch (error) {
      setLoading(false)
      // console.log(error)
    }
    setProducts("")
  }
// delete products

  const deleteProduct = async (item) => {
    setLoading(true)
    try {

      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success('Product Deleted successfully')
      getProductData()
      setLoading(false)

    } catch (error) {
      toast.success('Product Deleted Falied')
      setLoading(false)
    }
  }
  const [order,setOrder]=useState([]);

  const getOrderData = async () => {
    setLoading(true)
    try {
        const result = await getDocs(collection(fireDB, "orders"))
        const ordersArray=[];
        result.forEach((docs)=>{
          ordersArray.push(docs.data());
          setLoading(false);
        });
      setOrder(ordersArray)
      console.log(ordersArray)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }


    // get user data

    const [user, setUser] = useState([]);

    const getUserData = async () => {
      setLoading(true)
      try {
        const result = await getDocs(collection(fireDB, "users"))
        const usersArray = [];
        result.forEach((doc) => {
          usersArray.push(doc.data());
          setLoading(false)
        });
        setUser(usersArray);
        console.log(usersArray)
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }


useEffect(()=>{
  getOrderData();
  getUserData()
},[]);

const [searchkey, setSearchkey] = useState('')
const [filterType, setFilterType] = useState('')
const [filterPrice, setFilterPrice] = useState('')

  return (
    <MyContext.Provider value={{mode,toggleMode,loading, setLoading,
     products, setProducts,addProduct,product,edithandle,UpdateProduct,deleteProduct,order,user,searchkey, setSearchkey,filterType, setFilterType,filterPrice, setFilterPrice}}>
       {props.children}
    </MyContext.Provider>
  )
}

export default MyState