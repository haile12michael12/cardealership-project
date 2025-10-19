import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { Helmet } from "react-helmet";

const AnalyticsPage = () => {
  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - AutoDrive Admin</title>
        <meta 
          name="description" 
          content="View comprehensive analytics and insights for your automotive dealership business"
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your dealership performance
          </p>
        </div>
        
        <AnalyticsDashboard />
      </div>
    </>
  );
};

export default AnalyticsPage;