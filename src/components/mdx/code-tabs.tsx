import * as React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type CodeTabProps = {
  value: string;
  label: string;
  children: React.ReactNode;
};

export function CodeTab({ children }: CodeTabProps) {
  return <>{children}</>;
}

export function CodeTabs({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) {
  const tabs = React.Children.toArray(children).map((child, index) => {
    if (!React.isValidElement<CodeTabProps>(child) || child.type !== CodeTab) {
      throw new Error(`<CodeTabs> child ${index + 1} must be a <CodeTab>.`);
    }

    const { value, label, children: content } = child.props;
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`<CodeTab> child ${index + 1} needs a non-empty value.`);
    }
    if (typeof label !== "string" || !label.trim()) {
      throw new Error(`<CodeTab value="${value}"> needs a non-empty label.`);
    }
    if (React.Children.count(content) === 0) {
      throw new Error(`<CodeTab value="${value}"> needs code content.`);
    }

    return child;
  });

  if (tabs.length < 2) {
    throw new Error("<CodeTabs> needs at least two <CodeTab> children.");
  }

  const values = tabs.map((tab) => tab.props.value);
  if (new Set(values).size !== values.length) {
    throw new Error("<CodeTabs> values must be unique.");
  }

  const selectedValue = defaultValue ?? values[0];
  if (!values.includes(selectedValue)) {
    throw new Error(`<CodeTabs> defaultValue "${selectedValue}" has no matching tab.`);
  }

  return (
    <Tabs className="mdx-code-tabs" defaultValue={selectedValue}>
      <TabsList aria-label="代码语言" variant="line">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.props.value} value={tab.props.value}>
            {tab.props.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.props.value} value={tab.props.value}>
          {tab.props.children}
        </TabsContent>
      ))}
    </Tabs>
  );
}
