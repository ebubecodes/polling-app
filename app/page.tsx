import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="text-center space-y-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Create and Share Polls
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          polling-app makes it easy to create polls, gather votes, and share results with beautiful, modern interfaces.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/polls/new">Create Your First Poll</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/polls">View Example Polls</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Easy to Create</CardTitle>
            <CardDescription>
              Simple form-based poll creation with customizable options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create polls in seconds with our intuitive interface. Add multiple options, descriptions, and settings.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share Anywhere</CardTitle>
            <CardDescription>
              Share polls via links or QR codes for easy access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Generate unique links and QR codes to share your polls on social media, messaging apps, or anywhere.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Results</CardTitle>
            <CardDescription>
              See votes come in live with beautiful visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Watch results update in real-time with interactive charts and detailed analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
