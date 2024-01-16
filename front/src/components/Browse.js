import {useState, useEffect} from "react";
import {PRODUCTS_API_URL} from "../utils/constants";
import "../App.css"

const Browse = () => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch(PRODUCTS_API_URL)
            .then((res) => res.json())
            .then((response) => {
                let {products} = response
                setProducts(products)
            });
    };
    return (
        <div className="parent">
            {products.map((value => <div className="child" key={value.id}>
                    <img className="h-[80%] w-[100%]" src={value.thumbnail} alt="thumbnail"/>
                    <h3 className='pl-3 mr-2 overflow-hidden whitespace-nowrap no-scrollbar'> {value.title}</h3>
                    <span className='pl-3'>Price: ₹{value.price}</span>
                </div>
            ))}
        </div>
    )
}

export default Browse