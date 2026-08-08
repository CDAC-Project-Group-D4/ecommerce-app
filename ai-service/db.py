import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "manager"),
        database=os.getenv("DB_NAME", "ecommerce_db"),
        cursorclass=pymysql.cursors.DictCursor
    )

def fetch_catalog_context(user_query: str = ""):
    """
    Queries live product catalog, category names, price, stock, 
    and seller/store brand names from MySQL DB using exact database column names.
    """
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT 
                    p.id AS id,
                    p.product_name AS product_name,
                    p.price AS price,
                    p.stock AS stock,
                    c.name AS category_name,
                    s.store_name AS brand_or_seller
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                LEFT JOIN stores s ON p.store_id = s.id
                WHERE p.stock > 0
                LIMIT 50
            """
            cursor.execute(sql)
            products = cursor.fetchall()

            # Format price Decimal values to float for JSON serializability
            for item in products:
                if "price" in item and item["price"] is not None:
                    item["price"] = float(item["price"])

            print(f"Fetched {len(products)} products from MySQL for catalog context.")
            return products
    except Exception as e:
        print(f"Error fetching catalog from DB: {e}")
        return []
    finally:
        connection.close()
