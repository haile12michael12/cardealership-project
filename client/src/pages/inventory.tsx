import InventoryList from "@/components/inventory/InventoryList";
import { Helmet } from 'react-helmet';

const Inventory = () => {
  return (
    <>
      <Helmet>
        <title>Vehicle Inventory | AutoDrive</title>
        <meta 
          name="description" 
          content="Browse our extensive inventory of premium vehicles. Filter by make, model, price, and more to find your perfect car."
        />
      </Helmet>
      
      <div className="py-6 bg-gray-50">
        <InventoryList />
      </div>
    </>
  );
};

export default Inventory;
