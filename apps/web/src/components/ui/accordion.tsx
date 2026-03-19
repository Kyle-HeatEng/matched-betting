import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = AccordionPrimitive.Item;

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-2xl bg-[color:var(--brand)] px-5 py-4 text-left text-lg font-semibold text-white",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-5 w-5 transition group-data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.AccordionContentProps) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden rounded-b-2xl bg-[color:var(--panel)] text-[color:var(--foreground)]",
        className,
      )}
      {...props}
    >
      <div className="px-5 py-4 leading-7 text-[color:var(--muted-foreground)]">
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
