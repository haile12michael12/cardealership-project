import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize } from "lucide-react";

const VirtualTestDrive = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState("exterior");
  const [speed, setSpeed] = useState(1);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);
  const resetExperience = () => {
    setIsPlaying(false);
    setCurrentView("exterior");
    setSpeed(1);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Virtual Test Drive Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience your dream car from the comfort of your home. Take a virtual test drive with our immersive 360° experience.
          </p>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>2023 BMW 3 Series Virtual Test Drive</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetExperience}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  {/* Virtual test drive video placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="bg-gray-800 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        {isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </div>
                      <p className="text-lg">
                        {isPlaying ? "Virtual Test Drive in Progress" : "Click Play to Start Virtual Test Drive"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Video controls */}
                  <div className="absolute bottom-4 left-0 right-0">
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={togglePlay}
                        className="bg-black/50 hover:bg-black/70"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={toggleMute}
                        className="bg-black/50 hover:bg-black/70"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {/* View selector */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/50 rounded-lg p-1">
                      <div className="flex flex-col gap-1">
                        {["exterior", "interior", "dashboard"].map((view) => (
                          <Button
                            key={view}
                            size="sm"
                            variant={currentView === view ? "default" : "ghost"}
                            className="h-8 text-xs"
                            onClick={() => setCurrentView(view)}
                          >
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Speed controls */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Speed:</span>
                    <div className="flex gap-2">
                      {[0.5, 1, 1.5, 2].map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant={speed === s ? "default" : "outline"}
                          onClick={() => setSpeed(s)}
                        >
                          {s}x
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Virtual Test Drive Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <div className="bg-primary w-2 h-2 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">360° Exterior View</h4>
                      <p className="text-sm text-gray-600">Walk around the vehicle and examine every angle</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <div className="bg-primary w-2 h-2 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Interactive Interior</h4>
                      <p className="text-sm text-gray-600">Explore the cabin, seats, and controls in detail</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <div className="bg-primary w-2 h-2 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Driving Simulation</h4>
                      <p className="text-sm text-gray-600">Experience acceleration, braking, and handling</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <div className="bg-primary w-2 h-2 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Feature Highlights</h4>
                      <p className="text-sm text-gray-600">Learn about key features through interactive hotspots</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Ready to Experience in Person?</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Schedule a real test drive to feel the difference.
                  </p>
                  <Button className="w-full">
                    Schedule Test Drive
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VirtualTestDrive;