        //   {/* ================= APPROVAL RESULT ================= */}
        //   {isReviewed && (
        //     <>
        //       <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        //         <View>
        //           <Text className="text-gray-500 text-sm">Approval Status</Text>
        //           <Text
        //             className={`text-lg font-medium capitalize ${
        //               visit.approvalStatus === "approved"
        //                 ? "text-green-600"
        //                 : "text-red-600"
        //             }`}
        //           >
        //             {visit.approvalStatus}
        //           </Text>
        //         </View>
        //       </View>

        //       {/* Admin Note */}
        //       <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        //         <View>
        //           <Text className="text-gray-500 text-sm">Admin Note</Text>
        //           <Text className="text-lg font-medium">
        //             {visit.adminNote || "-"}
        //           </Text>
        //         </View>
        //       </View>

        //       {/* Rejection Reason */}
        //       {visit.approvalStatus === "rejected" && (
        //         <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
        //           <View>
        //             <Text className="text-gray-500 text-sm">Rejection Reason</Text>
        //             <Text className="text-lg font-medium text-red-600">
        //               {visit.rejectionReason || "-"}
        //             </Text>
        //           </View>
        //         </View>
        //       )}
        //     </>
        //   )}

        //   {/* ================= APPROVAL SECTION ================= */}   
        //   {!isReviewed && (
        //     <View className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        //       <Text className="text-base font-semibold mb-4">
        //         Review Visit
        //       </Text>

        //       <View className="gap-4">
        //         <FormSelectModal
        //           control={control}
        //           name="status"
        //           label="Approval Status"
        //           options={approval_status}
        //           getLabel={(item: { label: string }) => item.label}
        //           errors={errors}
        //         />

        //         <FormInput 
        //           control={control} 
        //           name="adminNote" 
        //           label="Notes" 
        //           errors={errors} 
        //         />
                
        //         {watch("status") === "rejected" && (
        //           <FormInput 
        //             control={control} 
        //             name="rejectionReason" 
        //             label="Rejection Reason" 
        //             errors={errors} 
        //           />
        //         )}
        //       </View>

        //       {/* Submit */}
        //       <Pressable
        //         onPress={handleSubmit(onSubmit)}
        //         className="bg-black rounded-lg p-4 mt-6"
        //       >
        //         <Text className="text-white text-center font-semibold">
        //           {isReviewing ? "Submitting..." : "Submit"}
        //         </Text>
        //       </Pressable>
        //     </View>
        //   )}