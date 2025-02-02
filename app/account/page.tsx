"use client";

import { useUser } from "@/hooks/useUser";

const AccountPage = () => {
  const { user, userDetails, subscription, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="mt-4">Please log in to view your account details.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Account</h1>
      <div className="mt-4">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Name:</strong> {userDetails?.name || "No name provided"}
        </p>
        <p>
          <strong>Subscription:</strong> {subscription?.status || "No subscription"}
        </p>
        <p>
          <strong>Plan:</strong> {subscription?.prices?.products?.name || "No plan selected"}
        </p>
      </div>
    </div>
  );
};

export default AccountPage;
