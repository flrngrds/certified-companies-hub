
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SubscriptionManager } from "@/components/profile/SubscriptionManager";
import { ContactForm } from "@/components/profile/ContactForm";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserData({
          name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : "",
          email: user.email || "",
        });
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            className="hover:bg-primary-light"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full md:w-auto flex space-x-2 bg-primary/10 p-1 rounded-lg">
            <TabsTrigger 
              value="profile" 
              className="flex-1 md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Profile Information
            </TabsTrigger>
            <TabsTrigger 
              value="subscription" 
              className="flex-1 md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="flex-1 md:flex-none data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              Contact Us
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <SubscriptionManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <ContactForm name={userData.name} email={userData.email} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
