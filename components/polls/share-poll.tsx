"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SharePollProps {
  pollId?: string;
}

export function SharePoll({ pollId }: SharePollProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Get the current URL (client-side only)
  const pollUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `${process.env.NEXT_PUBLIC_APP_URL || ''}/polls/${pollId || ''}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(pollUrl);
    const text = encodeURIComponent("Check out this poll!");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this poll</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleCopyLink}
          >
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleShareTwitter}
          >
            Share on Twitter
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={toggleQRCode}
          >
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </Button>
        </div>
        
        {showQR && (
          <div className="flex justify-center mt-4">
            <div className="p-4 bg-white rounded-md">
              <QRCode
                size={180}
                value={pollUrl}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
        )}

        {showQR && (
          <div className="text-center text-sm text-muted-foreground mt-2">
            Scan this QR code to access the poll on any device
          </div>
        )}
      </CardContent>
    </Card>
  );
}
