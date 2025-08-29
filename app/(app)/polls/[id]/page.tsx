type Params = { params: { id: string } };

export default async function PollDetailPage({ params }: Params) {
  const { id } = await params;

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-semibold mb-4">Poll #{id}</h1>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Question and options will render here.</p>
      </div>
    </div>
  );
}
