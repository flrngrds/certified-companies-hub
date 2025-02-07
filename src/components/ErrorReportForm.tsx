
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ErrorReportFormProps {
  companyName: string;
  onBack: () => void;
}

export const ErrorReportForm = ({ companyName, onBack }: ErrorReportFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [source, setSource] = useState("");
  const [certLevel, setCertLevel] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("Reported Error")
        .insert({
          company_name: companyName,
          source_url: source,
          certification_level: certLevel,
          publication_date: pubDate,
          client_id: companyName, // This links to the EcoVadis-certified table
        });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      toast({
        title: "Success",
        description: "Error report submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit error report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="text-lg font-medium text-gray-900">
          Thank you for your help! Our team will review it as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center mb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Report an Error</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <Input value={companyName} disabled />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <Input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source URL or reference"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certification Level
          </label>
          <Select value={certLevel} onValueChange={setCertLevel} required>
            <SelectTrigger>
              <SelectValue placeholder="Select certification level" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publication Date
          </label>
          <Input
            type="date"
            value={pubDate}
            onChange={(e) => setPubDate(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Report"}
        </Button>
      </div>
    </form>
  );
};
