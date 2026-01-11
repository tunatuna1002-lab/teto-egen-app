import React, { useEffect } from 'react';

/**
 * AdBanner Component
 * 
 * IMPORTANT: Replace 'client' and 'slot' props with your actual Google AdSense IDs.
 * You can find these in your Google AdSense dashboard.
 */
interface AdBannerProps {
    client?: string;
    slot?: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: 'true' | 'false';
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export const AdBanner: React.FC<AdBannerProps> = ({
    // Replace with your actual AdSense Publisher ID (e.g., "ca-pub-1234567890123456")
    client = "ca-pub-8933937663555578",
    // Replace with your actual Ad Slot ID (e.g., "1234567890")
    slot = "XXXXXXXXXX",
    format = "auto",
    responsive = "true",
    className = ""
}) => {
    useEffect(() => {
        try {
            // Push the ad to the adsbygoogle array
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            // Handle cases where AdSense script might be blocked or failed to load
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <div className={`ad-container overflow-hidden flex justify-center min-h-[100px] bg-gray-50/50 rounded-lg ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    );
};
