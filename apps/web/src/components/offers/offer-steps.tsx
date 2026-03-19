import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { OfferStep } from "@/lib/demo-data";

type OfferStepsProps = {
  steps: OfferStep[];
};

export function OfferSteps({ steps }: OfferStepsProps) {
  return (
    <Accordion className="space-y-4" collapsible defaultValue={steps[0]?.id} type="single">
      {steps.map((step, index) => (
        <AccordionItem className="space-y-3 border-none" key={step.id} value={step.id}>
          <AccordionTrigger>
            {index + 1}. {step.title}
          </AccordionTrigger>
          <AccordionContent>{step.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
