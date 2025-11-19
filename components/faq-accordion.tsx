"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface FaqItem {
  question: string;
  questionDisplay: ReactNode;
  answerDisplay: ReactNode;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <Card key={item.question} className="bg-muted/30">
            <CardHeader className="p-0">
              <Button
                variant="ghost"
                className="w-full justify-between p-6 h-auto hover:bg-muted/50"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${index}`}
              >
                <h3 className="text-base md:text-xl font-medium md:font-semibold text-left">
                  {item.questionDisplay}
                </h3>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 ml-4 flex-shrink-0" style={{ color: "#4cccc3" }} />
                ) : (
                  <ChevronDown className="h-5 w-5 ml-4 flex-shrink-0" style={{ color: "#4cccc3" }} />
                )}
              </Button>
            </CardHeader>
            <CardContent
              id={`faq-content-${index}`}
              className={`pt-0 pb-6 px-6 transition-all duration-200 ${
                isOpen
                  ? "max-h-[2000px] opacity-100"
                  : "max-h-0 overflow-hidden opacity-0 p-0"
              }`}
            >
              <div className="text-muted-foreground">{item.answerDisplay}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

