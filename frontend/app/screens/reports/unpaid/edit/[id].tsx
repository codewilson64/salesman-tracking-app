import {
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import back from "../../../../assets/globalIcons/back.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useGetTransactionById } from "../../../../hooks/transaction/useGetTransactionById";
import { useUpdateTransactionPayment } from "../../../../hooks/transaction/useUpdateTransaction";
import { TUpdateTransactionPaymentInput } from "../../../../libs/updateTransactionPayment.schema";

import { formatDate, formatTime } from "../../../../helper/formatTime";
import { FormInput } from "../../../../components/areaInputForm/FormInput";
import { FormSelectModal } from "../../../../components/areaInputForm/FormSelectModal";
import { useAuthStore } from "../../../../stores/authStore";
import { useMarkUnpaidTransactionAsRead } from "../../../../hooks/notification/transactions-menus/useMarkUnpaidTransactionAsRead";

const paymentMethods = ["cash", "transfer"];

const TransactionDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const user = useAuthStore((state) => state.user);

  const { data: transaction, isLoading } = useGetTransactionById(id);
  const { mutateAsync, isPending } = useUpdateTransactionPayment();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<TUpdateTransactionPaymentInput>({
    defaultValues: {
      paidAmount: 0,
      paymentType: null,
    },
  });

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { mutate } = useMarkUnpaidTransactionAsRead();
  
  useEffect(() => {
    if (id) mutate(id);
  }, [id, mutate]);

  const onRefresh = async () => {
    setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["transaction", id] });
    setRefreshing(false);
  };

  /* ================= WATCH ================= */

  const paidAmount = watch("paidAmount");
  const paymentType = watch("paymentType");

  const isDisabled = !paidAmount || Number(paidAmount) <= 0 || !paymentType || isPending;

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (!transaction) return;

    reset({
      paidAmount: 0, // always input fresh payment
      paymentType: null,
    });
  }, [transaction]);

  /* ================= DERIVED VALUES ================= */
  
  const remainingAfterPayment = Number(transaction?.remainingAmount || 0) - Number(paidAmount || 0);

  const onSubmit = async (data: TUpdateTransactionPaymentInput) => {
    try {
      await mutateAsync({ id, data });
      router.back();
    } catch {
      setError("root", { message: "Update payment failed" });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
    }

  if (!transaction) {
      return (
        <View className="flex-1 justify-center items-center">
            <Text>Transaction not found</Text>
        </View>
      );
    }

  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1 "
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24 }}
          refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#2563EB"]} // optional: Android spinner color
                tintColor="#2563EB"  // optional: iOS spinner color
            />
          }
        >
          {/* HEADER */}
          <View className="flex-row items-center mb-8">
            <Pressable onPress={() => router.back()} className="mr-3">
              <Image source={back} className="w-6 h-6" />
            </Pressable>

            <Text className="text-2xl font-bold">Transaction Detail</Text>
          </View>

          <View className="gap-4">
            {/* Name */}
            <View>
              <Text className="text-gray-500">Salesman</Text>
              <Text className="font-semibold">
                {transaction.salesmanName}
              </Text>
            </View>

            {/* Date of visit */}
            <View>
              <Text className="text-gray-500">Date of visit</Text>
              <Text className="font-semibold">
                {formatTime(transaction.checkInAt)}
              </Text>
            </View>

            {/* SHOP NAME */}
            <View>
              <Text className="text-gray-500">Shop</Text>
              <Text className="font-semibold">
                {transaction.shopName}
              </Text>
            </View>

            {/* TRANSACTION TYPE */}
            <View>
              <Text className="text-gray-500">Transaction Type</Text>
              <Text className="font-semibold capitalize">
                {transaction.transactionType}
              </Text>
            </View>

            {/* DUE DATE */}
            {transaction.transactionType === "credit" && (
              <View>
                <Text className="text-gray-500">Due date</Text>
                <Text className="font-semibold capitalize">
                  {formatDate(transaction.dueDate)}
                </Text>
              </View>
            )}

            {/* Payment Status */}
            <View>
              <Text className="text-gray-500">Payment Status</Text>
              <Text className="font-semibold capitalize">
                {transaction.paymentStatus}
              </Text>
            </View>

            {/* FINAL AMOUNT */}
            <View>
              <Text className="text-gray-500 mb-1">Final Amount</Text>
              <View className="p-3 bg-gray-100 rounded-lg">
                <Text className="font-semibold">
                  Rp {Number(transaction.finalAmount).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* REMAINING */}
            <View>
              <Text className="text-gray-500 mb-1">Remaining</Text>
              <View className="p-3 bg-gray-100 rounded-lg">
                <Text className="font-semibold text-red-500">
                  Rp {Number(transaction.remainingAmount).toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push(
                  user?.role === "salesman"
                    ? `screens/visits/${transaction.visitId}`
                    : `screens/sales-visits/${transaction.visitId}`
                )
              }
              className="flex-row items-center active:opacity-70 mb-8"
            >
              <View className="flex-row items-center flex-1">
                <Text className="font-normal text-blue-600 text-lg underline">
                  See visit detail
                </Text>
              </View>
            </TouchableOpacity>

            {/* PAYMENT SECTION */}
            {transaction.transactionType === "credit" && transaction.remainingAmount > 0 && (
              <>
                {user?.role === "salesman" && (
                  <FormInput
                    control={control}
                    name="paidAmount"
                    label="Pay Amount"
                    keyboardType="numeric"
                  />
                )}

                {/* PREVIEW AFTER PAYMENT */}
                {Number(paidAmount) > 0 && (
                  <View className="p-3 bg-green-50 rounded-lg">
                    <Text className="text-green-700 font-medium">
                      Remaining after payment:
                    </Text>
                    <Text className="text-green-700 font-bold">
                      Rp {Math.max(0, remainingAfterPayment).toLocaleString()}
                    </Text>
                  </View>
                )}

                {Number(paidAmount) > 0 && (
                  <FormSelectModal
                    control={control}
                    name="paymentType"
                    label="Payment Method"
                    options={paymentMethods.map((p) => ({ value: p }))}
                    getLabel={(item: { value: string }) => item.value}
                    errors={errors}
                  />
                )}
              </>
            )}

            {/* FULLY PAID STATE */}
            {transaction.remainingAmount === 0 && (
              <View className="p-4 bg-green-100 rounded-lg">
                <Text className="text-green-700 font-semibold text-center">
                  Fully Paid
                </Text>
              </View>
            )}
          </View>

          {/* SUBMIT */}
          {transaction.remainingAmount > 0 && user?.role === "salesman" && (
            <Pressable
              disabled={isDisabled}
              onPress={handleSubmit(onSubmit)}
              className={`rounded-lg p-4 mt-6 ${
                isDisabled ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              <Text className="text-white text-center font-semibold">
                {isPending ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TransactionDetailScreen;