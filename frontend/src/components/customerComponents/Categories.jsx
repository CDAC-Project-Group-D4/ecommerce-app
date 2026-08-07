import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categoryApi";

function Categories() {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await getAllCategories();

            console.log(response.data);

            setCategories(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container py-5">

            <h2 className="text-center fw-bold mb-5">
                Shop By Category
            </h2>

            <div className="row">

                {categories.map((category) => (

                    <div
                        className="col-lg-3 col-md-4 col-sm-6 mb-4"
                        key={category.id}
                    >

                        <div className="card shadow border-0 h-100">

                            <img
                                src={`http://localhost:8080${category.imageUrl}`}
                                className="card-img-top"
                                style={{
                                    height: "220px",
                                    objectFit: "cover"
                                }}
                                alt={category.name}
                            />

                            <div className="card-body text-center">

                                <h5>{category.name}</h5>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Categories;