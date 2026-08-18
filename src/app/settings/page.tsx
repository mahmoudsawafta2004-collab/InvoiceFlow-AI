"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { KeyRound, ExternalLink, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKey, setStoredApiKey } from "@/lib/storage";

export default function SettingsPage() {
  const storedKey = useApiKey();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    const value = inputRef.current?.value.trim() || "";
    setStoredApiKey(value);
    toast.success(value ? "API key saved" : "API key removed");
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = "";
    setStoredApiKey("");
    toast.success("API key removed");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Settings</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Connect your AI provider to enable invoice extraction.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
              <KeyRound className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Gemini API Key</CardTitle>
              <CardDescription>
                Stored locally in your browser. Never sent anywhere except our extraction endpoint.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              key={storedKey}
              id="api-key"
              ref={inputRef}
              type="password"
              placeholder="AIza..."
              defaultValue={storedKey}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" onClick={handleSave}>
              <Save className="h-4 w-4" />
              Save key
            </Button>
            {storedKey && (
              <Button variant="ghost" onClick={handleClear}>
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Get a free Gemini API key
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
