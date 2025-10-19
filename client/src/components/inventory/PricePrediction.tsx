import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  usePricePrediction, 
  usePriceHistory, 
  useComparableVehicles,
  VehicleSpecs
} from "@/hooks/usePricePrediction";
import { Loader2, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface PricePredictionProps {
  vehicleSpecs: VehicleSpecs;
}

const PricePrediction = ({ vehicleSpecs }: PricePredictionProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showComparables, setShowComparables] = useState(false);
  
  const pricePrediction = usePricePrediction();
  const priceHistory = usePriceHistory();
  const comparableVehicles = useComparableVehicles();
  
  const handlePredictPrice = async () => {
    try {
      await pricePrediction.mutateAsync(vehicleSpecs);
      await priceHistory.mutateAsync(vehicleSpecs);
    } catch (error) {
      console.error("Failed to predict price:", error);
    }
  };
  
  const handleShowComparables = async () => {
    try {
      await comparableVehicles.mutateAsync(vehicleSpecs);
      setShowComparables(true);
    } catch (error) {
      console.error("Failed to get comparables:", error);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Price Prediction</CardTitle>
        <CardDescription>
          Get AI-powered price estimates for this vehicle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!pricePrediction.data ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Click below to get an AI-powered price prediction for this vehicle
            </p>
            <Button 
              onClick={handlePredictPrice}
              disabled={pricePrediction.isPending}
            >
              {pricePrediction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Predict Price"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Prediction Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(pricePrediction.data.predictedPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Predicted Price
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {pricePrediction.data.confidence}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidence Score
                  </div>
                  <Progress 
                    value={pricePrediction.data.confidence} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(pricePrediction.data.predictedPrice - (vehicleSpecs.price || 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pricePrediction.data.predictedPrice > (vehicleSpecs.price || 0) ? "Above" : "Below"} Asking Price
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Price History Chart */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Price Trend</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? "Hide" : "Show"} History
                </Button>
              </div>
              
              {showHistory && priceHistory.data && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistory.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(Number(value)), "Price"]}
                        labelFormatter={formatDate}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            {/* Pricing Factors */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Pricing Factors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factor</TableHead>
                      <TableHead>Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(pricePrediction.data.factors.marketFactors.details).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                        <TableCell>{value as string}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factor</TableHead>
                      <TableHead>Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(pricePrediction.data.factors.conditionAdjustments.details).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                        <TableCell>{value as string}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* Comparable Vehicles */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Comparable Vehicles</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShowComparables}
                  disabled={comparableVehicles.isPending}
                >
                  {comparableVehicles.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Show Comparables"
                  )}
                </Button>
              </div>
              
              {showComparables && comparableVehicles.data && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparableVehicles.data.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                        </TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>{vehicle.mileage.toLocaleString()} miles</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(vehicle.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Price prediction completed with {pricePrediction.data.confidence}% confidence</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PricePrediction;