import { useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/class/user.class";
import Back from "@/components/back";
import DatePicker from '@react-native-community/datetimepicker'
import dayjs from "dayjs";

const API_BASE = process.env.EXPO_PUBLIC_URI

async function getAuthToken(): Promise<string> {
    // e.g. return await SecureStore.getItemAsync("token") ?? "";
    return "";
}

// ─── types ────────────────────────────────────────────────────────────────────
type Sex = "male" | "female"

interface FormState {
    weight: string;
    height: string;
    sex: Sex | "";
    fast: string;
    date: string | any;
}

interface MacroResult {
    dailyCalories: number;
    dailyProtein: number;
    dailyFat: number;
    dailyCarbs: number;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
    return (
        <Text className="font-[ebold] text-gray-500 text-xs uppercase tracking-widest mb-2 mt-5">
            {label}
        </Text>
    );
}

function NumberInput({
    value, onChange, placeholder, unit,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    unit: string;
}) {
    return (
        <View className="flex-row items-center bg-white rounded-2xl px-5 py-4 shadow-sm">
            <TextInput
                className="flex-1 font-[ebold] text-gray-700 text-lg"
                keyboardType="numeric"
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={(t) => onChange(t.replace(/[^0-9.]/g, ""))}
            />
            <Text className="font-[ebold] text-gray-400 text-base ml-2">{unit}</Text>
        </View>
    );
}

function SegmentedPicker<T extends string>({
    options, value, onChange,
}: {
    options: T[];
    value: T | "";
    onChange: (v: T) => void;
}) {
    return (
        <View className="flex-row bg-white rounded-2xl overflow-hidden shadow-sm">
            {options.map((opt, idx) => {
                const selected = value === opt;
                return (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => onChange(opt)}
                        className={`flex-1 py-4 items-center ${selected ? "bg-gray-700" : "bg-white"} ${idx !== 0 ? "border-l border-gray-100" : ""}`}
                        activeOpacity={0.75}
                    >
                        <Text className={`font-[ebold] text-sm ${selected ? "text-white" : "text-gray-500"}`}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function MacroCard({ macros }: { macros: MacroResult }) {
    return (
        <View className="mt-6 bg-white rounded-2xl px-5 py-5 shadow-sm">
            <Text className="font-[ebold] text-gray-700 text-base mb-3">📊 Your Daily Targets</Text>
            <View className="flex-row flex-wrap gap-y-3">
                {[
                    { label: "Calories", value: `${macros.dailyCalories} kcal` },
                    { label: "Protein", value: `${macros.dailyProtein} g` },
                    { label: "Carbs", value: `${macros.dailyCarbs} g` },
                    { label: "Fat", value: `${macros.dailyFat} g` },
                ].map((item) => (
                    <View key={item.label} className="w-1/2 pr-2">
                        <Text className="font-[ebold] text-gray-400 text-xs uppercase tracking-widest">{item.label}</Text>
                        <Text className="font-[ebold] text-gray-700 text-lg">{item.value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function EditProfileScreen() {
    const [form, setForm] = useState<FormState>({
        weight: "", height: "", sex: "", fast: "", date: new Date()
    });
    const [loading, setLoading] = useState(false);
    const [macros, setMacros] = useState<MacroResult | null>(null);

    const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    const handleSave = async () => {
        const { weight, height, sex, fast, date } = form;

        if (!weight || !height || !sex || !fast || !date) {
            Alert.alert("Missing fields", "Please fill in all details before saving.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token")

            const { data } = await axios.patch(
                `${API_BASE}/profile`,
                {
                    weight: parseFloat(weight),
                    height: parseFloat(height),
                    sex,
                    fast: parseFloat(fast),
                    date: date
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.macros) {
                setMacros(data.macros);
                Alert.alert(
                    "Profile Updated ✓",
                    `Daily targets recalculated:\n${data.macros.dailyCalories} kcal • ${data.macros.dailyProtein}g protein`,
                    [{ text: "Done", onPress: () => router.back() }]
                );
            } else {
                Alert.alert("Saved!", "Profile updated.", [
                    { text: "OK", onPress: () => router.replace("/home") },
                ]);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message ?? err.message;
            Alert.alert("Error", msg);
        } finally {
            setLoading(false);
        }
    };


    let [user, setUser] = useState<any>(null)

    useFocusEffect(useCallback(() => {
        (async () => {
            let u = new User()


            let res: any = await u.getUserData()


            console.log(res)

            setUser(res)
            setForm({
                weight: res.weight ? String(res.weight) : "",
                height: res.height ? String(res.height) : "",
                sex: res.sex ? res.sex : "male",
                fast: res.fast ? String(res.fast) : "",
                date: res.dob ? new Date(res.dob) : new Date()
            })
        })()
    }, []))

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-100 pt-15"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >

            {/* form */}
            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 48 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >

                <View className="flex flex-row gap-2 mb-5">
                    <Back></Back>
                    <Text className="font-[ebold] text-xl">Edit Profile</Text>
                </View>




                <SectionLabel label="Date of birth" />
                <View className="w-full flex justify-center items-center ml-[-10px]">
                    <DatePicker mode="date" value={form.date} onChange={(t, d: any) => {
                        setForm({
                            ...form,
                            date: d
                        })
                    }}></DatePicker>
                </View>

                <SectionLabel label="Weight" />
                <NumberInput
                    value={form.weight}
                    onChange={(v) => set("weight", v)}
                    placeholder="e.g. 70"
                    unit="kg"
                />

                <SectionLabel label="Height" />
                <NumberInput
                    value={form.height}
                    onChange={(v) => set("height", v)}
                    placeholder="e.g. 175"
                    unit="cm"
                />


                <SectionLabel label="Caloric Deficit" />
                <NumberInput
                    value={form.fast}
                    onChange={(v) => set("fast", v)}
                    placeholder="แนะนำ 100 - 500"
                    unit="kcal"
                />

                <SectionLabel label="Gender" />
                <SegmentedPicker<Sex>
                    options={["male", "female"]}
                    value={form.sex}
                    onChange={(v) => set("sex", v)}
                />

                {macros && <MacroCard macros={macros} />}

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className="mt-8 w-full py-5 bg-gray-700 rounded-2xl items-center"
                    activeOpacity={0.85}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <Text className="font-[ebold] text-white text-lg">Save Changes</Text>}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}