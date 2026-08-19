"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import type { Plan } from "@/lib/supabase/types";
import { updatePlanAction } from "@/app/(app)/admin/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function PlanEditor({ plans }: { plans: Plan[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <PlanRow key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

function PlanRow({ plan }: { plan: Plan }) {
  const [name, setName] = useState(plan.name);
  const [dollars, setDollars] = useState((plan.price_cents / 100).toString());
  const [limit, setLimit] = useState(plan.monthly_invoice_limit.toString());
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const price_cents = Math.round(parseFloat(dollars || "0") * 100);
    const monthly_invoice_limit = parseInt(limit || "0", 10);

    if (Number.isNaN(price_cents) || Number.isNaN(monthly_invoice_limit)) {
      toast.error("Enter valid numbers.");
      return;
    }

    startTransition(async () => {
      try {
        await updatePlanAction(plan.id, {
          name,
          price_cents,
          monthly_invoice_limit,
          is_active: plan.is_active,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't save.");
      }
    });
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <Label htmlFor={`name-${plan.id}`}>Plan name</Label>
          <Input id={`name-${plan.id}`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`price-${plan.id}`}>Price / month (USD)</Label>
          <Input
            id={`price-${plan.id}`}
            type="number"
            min="0"
            step="0.01"
            value={dollars}
            onChange={(e) => setDollars(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`limit-${plan.id}`}>Invoices / month</Label>
          <Input
            id={`limit-${plan.id}`}
            type="number"
            min="0"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>
        <Button
          size="sm"
          variant={saved ? "outline" : "primary"}
          className="w-full"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <Check className="h-3.5 w-3.5" />
          ) : null}
          {saved ? "Saved" : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}
