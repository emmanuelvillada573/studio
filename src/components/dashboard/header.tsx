"use client"

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Download, Menu, Wallet } from "lucide-react";

interface HeaderProps {
  onExport: () => void;
}

export function Header({ onExport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-2">
        <Wallet className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-headline font-bold text-foreground">
          HomeBase Economy
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={onExport}>
          <Download className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Export
          </span>
        </Button>
      </div>
    </header>
  );
}
