import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PollForm } from "@/components/polls/poll-form";

export default function NewPollPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <PollForm />
        </CardContent>
      </Card>
    </div>
  );
}


