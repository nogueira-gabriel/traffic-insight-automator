import { useState, useEffect } from "react";
import { FileUploadArea } from "@/components/FileUploadArea";
import { ReportDashboard } from "@/components/ReportDashboard";
import { Header } from "@/components/Header";
import { EmptyState } from "@/components/EmptyState";

export interface TrafficData {
  date: string;
  campaignname?: string;
  reach?: number;
  impressions: number;
  clicks: number;
  cost: number;
  conversions?: number;
  leads?: number;
  revenue?: number;
  costPerLead?: number;
  // Social Media fields (for future expansion)
  likes?: number;
  comments?: number;
  shares?: number;
  followers?: number;
  engagement?: number;
  posts?: number;
  stories?: number;
  reels?: number;
  saves?: number;
  profileVisits?: number;
}

const Index = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoaded = (data: TrafficData[]) => {
    setTrafficData(data);
    // Scroll to top when dashboard loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setTrafficData([]);
    // Scroll to top when resetting
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-full overflow-x-hidden">
        {trafficData.length === 0 ? (
          <div className="max-w-6xl mx-auto space-y-12 w-full">
            <EmptyState />
            <FileUploadArea 
              onDataLoaded={handleDataLoaded}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <ReportDashboard 
              data={trafficData} 
              onReset={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;