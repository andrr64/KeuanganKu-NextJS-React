'use client';

import GoalItem from "@/components/items/GoalItem";
import { Progress } from "@/components/ui/Progress";
import { formatUang } from "@/lib/utils/formatUtil";
import { GoalModel } from "@/types/model/Goal";
import { FaBullseye, FaPlus, FaTrash } from "react-icons/fa";
import { FaRegClipboard } from "react-icons/fa6";

interface Props {
  goals?: GoalModel[];
  onHapus?: (goalId: string) => void;
  onTambahUang?: (goalId: string) => void;
}

export default function RingkasanGoalSection({
  goals = []
}: Props) {
  const isKosong = goals.length === 0;

  return (
    <section className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-700 dark:text-white flex items-center gap-2">
        <FaBullseye className="text-indigo-600" />
        Goal
      </h2>

      {isKosong ? (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-300">
            <FaRegClipboard className="text-3xl text-indigo-500" />
            <p className="text-sm">Belum ada goal yang ditambahkan.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tambahkan goal untuk mulai menabung dengan tujuan!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
          {goals.map((goal) =>
            <GoalItem
              goal={goal}
              progress={0}
              formatRupiah={formatUang}
              onEdit={function (goal: GoalModel): void {
              }} 
              onToggleStatus={function (goal: GoalModel): void {
              }} 
              onTambahUang={function (): void {
              }} 
              onKurangiUang={function (): void {
              }} 
              onHapus={function (): void {
              }} 
              getProgressColor={function (progress: number): string {
                throw new Error("Function not implemented.");
              }} />)}
        </div>
      )}
    </section>
  );
}
