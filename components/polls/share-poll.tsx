"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SharePoll() {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this poll!");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share this poll</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleCopyLink}
          >
            Copy Link
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleShareTwitter}
          >
            Share on Twitter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
