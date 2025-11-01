import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useTestDriveAvailability } from "@/hooks/useTestDriveAvailability";

interface TestDriveAvailabilityProps {
  vehicleId: string;
  location: string;
}

const TestDriveAvailability = ({ vehicleId, location }: TestDriveAvailabilityProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  
  // Set tomorrow as the default date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
  }, []);

  const { data: availability, isLoading, isError } = useTestDriveAvailability({
    vehicleId,
    date: selectedDate.toISOString(),
    location
  });

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Test Drive Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Select Date</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              
              if (isToday) return null;
              
              return (
                <Button
                  key={i}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="h-12 flex flex-col text-xs"
                  onClick={() => handleDateChange(date)}
                >
                  <span className="font-medium">{format(date, "EEE")}</span>
                  <span>{format(date, "MMM d")}</span>
                </Button>
              );
            })}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Available Time Slots</h3>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-pulse">Checking availability...</div>
            </div>
          ) : isError ? (
            <div className="text-center py-4 text-red-500">
              <AlertCircle className="h-5 w-5 mx-auto mb-1" />
              <p>Error checking availability</p>
            </div>
          ) : availability ? (
            <div>
              <div className="flex items-center mb-2 text-sm">
                {availability.available ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span>
                  {availability.availableSlots} of {availability.totalSlots} slots available
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={
                      selectedTime === time 
                        ? "default" 
                        : availability.availableSlots > 0 
                          ? "outline" 
                          : "secondary"
                    }
                    size="sm"
                    disabled={!availability.available || availability.availableSlots <= 0}
                    onClick={() => setSelectedTime(time)}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Select a date to check availability
            </div>
          )}
        </div>
        
        {selectedTime && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="font-medium text-green-800">Slot Reserved</p>
                <p className="text-sm text-green-700">
                  {format(selectedDate, "EEEE, MMMM d")} at {selectedTime}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestDriveAvailability;