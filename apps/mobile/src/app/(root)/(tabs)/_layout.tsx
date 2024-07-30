import { Redirect, Tabs } from "expo-router";
import Icon from "@expo/vector-icons/FontAwesome6";
import { useStyle } from "@/lib/hooks/style";
import { Pill } from "@/lib/components/pill";
import { useAuthenticatedSession } from "@repo/hook/query";

function TabBarPill(
  iconName: string,
  { focused }: { focused: boolean; color: string; size: number },
) {
  const { theme } = useStyle({});

  return (
    <Pill
      color={focused ? theme.secondary.hex : theme.secondary.container.hex}
      padding={6}
    >
      <Icon
        size={20}
        name={iconName}
        color={
          focused ? theme.secondary.on.hex : theme.secondary.container.on.hex
        }
        solid
      />
    </Pill>
  );
}

export default function TabLayout() {
  const { stylesheet, theme } = useStyle({
    stylesheet: ({ theme }) => ({
      tabBar: {
        height: 60,
        backgroundColor: theme.secondary.container.hex,
        borderTopWidth: 0,
        elevation: 0,
      },
    }),
  });

  const { isLoading, isSuccess: isSignedIn } = useAuthenticatedSession();

  if (isLoading) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: "Inter_700Bold",
        },
        tabBarStyle: stylesheet.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.secondary.hex,
        tabBarInactiveTintColor: theme.tertiary.hex,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: (props) => TabBarPill("house", props),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: (props) => TabBarPill("magnifying-glass", props),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: (props) => TabBarPill("user", props),
        }}
      />
    </Tabs>
  );
}
