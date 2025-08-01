"use client";

import { ArrowLeft, Mail, Phone, User, MessageSquare, Calendar, DownloadCloud, Printer } from "lucide-react";
import { useRouter } from "next/navigation";

import PageTitle from "@/components/shared/PageTitle";
import Typography from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useEnquiry } from "@/hooks/useEnquiries";
import { format } from "date-fns";

type PageParams = {
  params: {
    id: string;
  };
};

export default function EnquiryDetails({ params: { id } }: PageParams) {
  const router = useRouter();
  const { data: enquiry, isLoading, error } = useEnquiry(id);

  if (isLoading) {
    return (
      <section>
        <PageTitle>Enquiry Details</PageTitle>
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </Card>
      </section>
    );
  }

  if (error || !enquiry) {
    return (
      <section>
        <PageTitle>Enquiry Details</PageTitle>
        <Card className="p-6">
          <Typography className="text-center text-red-500">
            Failed to load enquiry details
          </Typography>
        </Card>
      </section>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Submitted":
        return "default";
      case "Contacted":
        return "secondary";
      case "In Progress":
        return "outline";
      case "Resolved":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "In Progress":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return format(date, "PPp");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <PageTitle>Enquiry Details</PageTitle>
      </div>

      <Card className="mb-8 text-muted-foreground p-4 lg:p-6">
        {/* ✅ Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-4 gap-y-6">
          <div className="flex flex-col">
            <Typography className="uppercase text-card-foreground mb-1.5 md:text-xl tracking-wide" variant="h2">
              Enquiry Details
            </Typography>

            <div className="flex items-center gap-x-2">
              <Typography className="uppercase font-semibold text-xs">status</Typography>
              <Badge
                variant={getStatusBadgeVariant(enquiry.status)}
                className={`flex-shrink-0 text-xs capitalize ${getStatusBadgeClass(enquiry.status)}`}
              >
                {enquiry.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col text-sm gap-y-0.5 md:text-right">
            <div className="flex items-center md:justify-end gap-x-1">
              <MessageSquare className="size-6 text-primary mb-1.5 flex-shrink-0" />
              <Typography component="span" variant="h2" className="text-card-foreground">Admin</Typography>
            </div>
            <Typography component="p">2 Lawson Avenue, California, United States</Typography>
            <Typography component="p">+1 (212) 456-7890</Typography>
            <Typography component="p" className="break-words">ecommerceadmin@gmail.com</Typography>
            <Typography component="p">ecommerce-admin-board.vercel.app</Typography>
          </div>
        </div>

        <Separator className="my-6" />

        {/* ✅ Enquiry Meta Info */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-10">
          <div>
            <Typography variant="p" component="h4" className="font-semibold uppercase text-card-foreground mb-1">
              date
            </Typography>
            <Typography className="text-sm">{formatDate(enquiry.createdAt)}</Typography>
          </div>

          <div>
            <Typography variant="p" component="h4" className="font-semibold uppercase text-card-foreground mb-1">
              enquiry id
            </Typography>
            <Typography className="text-sm">#{enquiry._id.slice(-8).toUpperCase()}</Typography>
          </div>

          <div className="md:text-right">
            <Typography variant="p" component="h4" className="font-semibold uppercase text-card-foreground mb-1">
              from
            </Typography>

            <div className="flex flex-col text-sm gap-y-0.5">
              <Typography component="p">{enquiry.name}</Typography>
              <Typography component="p" className="break-words">{enquiry.email}</Typography>
              <Typography component="p">{enquiry.mobile}</Typography>
            </div>
          </div>
        </div>

        {/* ✅ Enquiry Details */}
        <div className="bg-background rounded-lg p-6 md:px-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <Typography component="h4" className="font-medium text-sm uppercase mb-3 tracking-wide">
                Personal Information
              </Typography>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <Typography className="text-xs uppercase text-muted-foreground">Name</Typography>
                    <Typography className="font-medium">{enquiry.name}</Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <div>
                    <Typography className="text-xs uppercase text-muted-foreground">Email</Typography>
                    <Typography className="font-medium break-words">{enquiry.email}</Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <div>
                    <Typography className="text-xs uppercase text-muted-foreground">Mobile</Typography>
                    <Typography className="font-medium">{enquiry.mobile}</Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="size-4 text-muted-foreground" />
                  <div>
                    <Typography className="text-xs uppercase text-muted-foreground">Submitted</Typography>
                    <Typography className="font-medium">{formatDate(enquiry.createdAt)}</Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-4">
              <Typography component="h4" className="font-medium text-sm uppercase mb-3 tracking-wide">
                Message
              </Typography>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <Typography className="whitespace-pre-wrap text-sm leading-relaxed">
                  {enquiry.comment}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Status Information */}
        <div className="bg-background rounded-lg p-6 md:px-8 mb-4">
          <Typography component="h4" className="font-medium text-sm uppercase mb-3 tracking-wide">
            Status Information
          </Typography>
          
          <div className="flex items-center gap-3">
            <Badge
              variant={getStatusBadgeVariant(enquiry.status)}
              className={`text-sm capitalize ${getStatusBadgeClass(enquiry.status)}`}
            >
              {enquiry.status}
            </Badge>
            <Typography className="text-sm text-muted-foreground">
              {enquiry.status === "Submitted" && "Enquiry has been submitted and is awaiting review"}
              {enquiry.status === "Contacted" && "Customer has been contacted regarding their enquiry"}
              {enquiry.status === "In Progress" && "Enquiry is currently being processed"}
              {enquiry.status === "Resolved" && "Enquiry has been resolved successfully"}
            </Typography>
          </div>
        </div>
      </Card>

      {/* ✅ Actions */}
      <div className="flex flex-wrap gap-3 justify-between">
        <Button 
          size="lg" 
          variant="outline"
          onClick={() => window.print()}
        >
          Print Details <Printer className="ml-2 size-4" />
        </Button>
        <Button 
          size="lg"
          onClick={() => {
            // TODO: Implement download functionality
            console.log("Download enquiry details");
          }}
        >
          Download Details <DownloadCloud className="ml-2 size-4" />
        </Button>
      </div>
    </section>
  );
} 