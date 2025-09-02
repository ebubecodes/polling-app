export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="container mx-auto max-w-6xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border-2 border-destructive flex items-center justify-center">
            <span className="text-xs font-bold text-destructive">N</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          © 2025 polling-app. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
