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
import { useLanguageStore } from "@/stores/language.store";

const API_BASE = process.env.EXPO_PUBLIC_URI

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
    const { t } = useLanguageStore()
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
                            {t(opt as any)}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

function MacroCard({ macros }: { macros: MacroResult }) {
    const { t } = useLanguageStore()
    return (
        <View className="mt-6 bg-white rounded-2xl px-5 py-5 shadow-sm">
            <Text className="font-[ebold] text-gray-700 text-base mb-3">📊 {t('yourDailyTargets')}</Text>
            <View className="flex-row flex-wrap gap-y-3">
                {[
                    { label: t('kcalLabel'), value: `${macros.dailyCalories} kcal` },
                    { label: t('protein'), value: `${macros.dailyProtein} g` },
                    { label: t('carbs'), value: `${macros.dailyCarbs} g` },
                    { label: t('fat'), value: `${macros.dailyFat} g` },
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

export default function EditProfileScreen() {
    const { t, locale } = useLanguageStore()
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
            Alert.alert(t('missingFields'), t('fillAllDetails'));
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
                    t('profileUpdated'),
                    t('dailyTargetsRecalculated', { calories: data.macros.dailyCalories, protein: data.macros.dailyProtein }),
                    [{ text: t('done'), onPress: () => router.back() }]
                );
            } else {
                Alert.alert(t('saved'), t('profileUpdatedMsg'), [
                    { text: "OK", onPress: () => router.replace("/home") },
                ]);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message ?? err.message;
            Alert.alert(t('error'), msg);
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
            key={locale}
            className="flex-1 bg-gray-50 pt-12"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 24 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Section */}
                <View className="flex-row items-center gap-4 mb-8 mt-2">
                    <Back />
                    <Text className="font-[ebold] text-2xl text-gray-800">{t('editProfileTitle')}</Text>
                </View>

                {/* Main Form Card */}
                <View className="bg-white rounded-[32px] p-6 shadow-sm shadow-gray-200/50 mb-6 border border-gray-100">

                    {/* Date of Birth */}
                    <View className="mb-6">
                        <SectionLabel label={t('dateOfBirth')} />
                        <View className="w-full py-2 flex-row justify-center items-center bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                            <DatePicker
                                maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 15))}
                                mode="date"
                                value={form.date}
                                onChange={(t, d: any) => setForm({ ...form, date: d })}
                                locale={locale === 'th' ? 'th-TH' : 'en-GB'}
                            />
                        </View>
                    </View>

                    {/* Weight & Height (Row) */}
                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1">
                            <SectionLabel label={t('weight')} />
                            <View className="mt-2">
                                <NumberInput
                                    value={form.weight}
                                    onChange={(v) => set("weight", v)}
                                    placeholder="70"
                                    unit={t('kg')}
                                />
                            </View>
                        </View>

                        <View className="flex-1">
                            <SectionLabel label={t('height')} />
                            <View className="mt-2">
                                <NumberInput
                                    value={form.height}
                                    onChange={(v) => set("height", v)}
                                    placeholder="175"
                                    unit={t('cm')}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Caloric Deficit */}
                    <View className="mb-6">
                        <SectionLabel label={t('caloricDeficit')} />
                        <View className="mt-2">
                            <NumberInput
                                value={form.fast}
                                onChange={(v) => set("fast", v)}
                                placeholder="แนะนำ 100 - 500"
                                unit={t('kcalLabel')}
                            />
                        </View>
                        <Text className="text-xs text-gray-400 font-[emedium] mt-2 ml-1">
                            {t('deficitRecommendation')}
                        </Text>
                    </View>

                    {/* Gender */}
                    <View className="mb-2">
                        <SectionLabel label={t('gender')} />
                        <View className="mt-2">
                            <SegmentedPicker<Sex>
                                options={["male", "female"]}
                                value={form.sex}
                                onChange={(v) => set("sex", v)}
                            />
                        </View>
                    </View>

                </View>

                {/* Macro Card (Outside the main form card to make it pop) */}
                {macros && (
                    <View className="mb-6">
                        <MacroCard macros={macros} />
                    </View>
                )}

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl items-center shadow-md ${loading ? 'bg-gray-400' : 'bg-gray-800 shadow-gray-400/30'
                        }`}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="font-[ebold] text-white text-lg tracking-wide">
                            {t('saveChanges')}
                        </Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}