'use client'

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import Link from "next/link";

const learningSections = [
  {
    id: "anxiety",
    title: "Understanding Anxiety",
    description: "Learn about anxiety, its causes, and coping mechanisms.",
    pdf: "/downloads/anxiety_guide.pdf",
    page: "/learning/anxiety"
  },
  {
    id: "depression",
    title: "Managing Depression",
    description: "Resources to help manage depression effectively.",
    pdf: "/downloads/depression_guide.pdf",
    page: "/learning/depression"
  },
  {
    id: "mindfulness",
    title: "Mindfulness Techniques",
    description: "Practical mindfulness exercises for better mental well-being.",
    pdf: "/downloads/mindfulness_guide.pdf",
    page: "/learning/mindfulness"
  },
];

export default function LearningSection() {
  const [search, setSearch] = useState("");
  
  const filteredSections = learningSections.filter((section) =>
    section.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mental Health Learning Section</h1>
      <Input
        type="text"
        placeholder="Search topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      
      <Tabs defaultValue="anxiety" className="w-full">
        <TabsList>
          {learningSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {filteredSections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-gray-600 mb-2">{section.description}</p>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <a href={section.pdf} download>
                      <Download className="mr-2" /> Download PDF
                    </a>
                  </Button>
                  <Button variant="default" asChild>
                    <Link href={section.page}>Read More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
