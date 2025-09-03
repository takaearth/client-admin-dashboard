"use client";
import React, { useState } from "react";
import { MarkerF, GoogleMap, InfoWindowF, useJsApiLoader, MarkerClustererF } from "@react-google-maps/api";
import { Card, CardDescription, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
//custom
import { cn } from "@/lib/utils";
import { useGetSmartbins } from "@/data/smartbins";
import { Smartbin } from "@/lib/types";

const libraries: any = ["places"];
const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: true,
};

const mapCenter = {
  lat: -1.2,
  lng: 36.821,
};

export default function SmartbinsMap({ className, ...props }: React.ComponentProps<"div">) {
  const id = "smartbins-map";

  const { data: smartbins, error, isFetched } = useGetSmartbins();
  const [activeMarker, setActiveMarker] = useState<string | number | null>(null);

  const { isLoaded } = useJsApiLoader({
    libraries,
    id: "google-map-script",
    // Ensure your API key is stored as NEXT_PRIVATE_FIREBASE_API_KEY in your .env file
    googleMapsApiKey: `${process.env.NEXT_PRIVATE_FIREBASE_API_KEY}`,
  });

  if (!isLoaded) {
    return (
      <div className="flex min-h-[20vh] justify-center items-center bg-white gap-3">
        <span className="loading loading-dots loading-md text-gray-400" />
        <span className="text-2xl text-gray-400 font-semibold">Loading Map</span>
      </div>
    );
  }

  const handleActiveMarker = (markerIdentifier: string | number) => {
    if (markerIdentifier === activeMarker) {
      return;
    }
    setActiveMarker(markerIdentifier);
  };

  const onClose = () => {
    setActiveMarker(null);
  };

  return (
    <Card data-slot="card" data-chart={id} className={cn("@container/card gap-3", className)} {...props}>
      <CardHeader className="flex flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Smartbins Map</CardTitle>
          <CardDescription>Geographical distribution of smartbins</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        {isFetched && !error && (
          <GoogleMap
            zoom={10}
            center={mapCenter}
            options={mapOptions as google.maps.MapOptions}
            onClick={() => setActiveMarker(null)}
            onLoad={() => console.log("Map Component Loaded...")}
            mapContainerStyle={{ width: "100%", height: "100%", minHeight: "400px" }}
          >
            <MarkerClustererF>
              {(clusterer) => (
                <React.Fragment>
                  {smartbins?.map((smartbin: Smartbin, i: number) => {
                    // Ensure smartbin.coords is valid before rendering MarkerF
                    // Also, consider using a stable ID from `smartbin` for `key` and `activeMarker` if available,
                    // instead of index `i`, especially if the list can be filtered or reordered.
                    if (!smartbin?.coords) {
                      return null; // Skip rendering if coords are missing
                    }
                    return (
                      <MarkerF
                        key={smartbin.id || i} // Use smartbin.id if available, otherwise fallback to index
                        clusterer={clusterer}
                        position={smartbin.coords} // Coords should be valid here
                        icon={"https://i.imgur.com/hZ07IQP.png"}
                        onLoad={() => console.log("Marker Loaded")}
                        onClick={() => handleActiveMarker(smartbin.id || i)}
                      >
                        {activeMarker === (smartbin.id || i) && (
                          <InfoWindowF onCloseClick={onClose}>
                            <div className="grid place-content-center pt-3 px-4">
                              <div className="">
                                <span className="text-xs">Name</span>
                                <h3 className="text-lg font-semibold">{smartbin?.name}</h3>
                                <span className="text-xs">Address</span>
                                <h3 className="text-sm font-semibold">{smartbin?.address?.city}</h3>
                              </div>
                            </div>
                          </InfoWindowF>
                        )}
                      </MarkerF>
                    );
                  })}
                </React.Fragment>
              )}
            </MarkerClustererF>
          </GoogleMap>
        )}
      </CardContent>
    </Card>
  );
}
