import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./section-heading";
import { Container } from "@/components/layout/container";

export function Faq({
  items,
  title = "Frequently asked questions",
  eyebrow = "FAQ",
}: {
  items: { question: string; answer: string }[];
  title?: string;
  eyebrow?: string;
}) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
}
