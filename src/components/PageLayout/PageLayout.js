import clsx from "clsx";
import { Layout } from "antd";

import PageHeader from "../PageHeader";
import styles from "./PageLayout.module.scss";

const PageLayout = ({ children, noScroll }) => {
  return (
    <Layout className={styles.layout}>
      <PageHeader />
      <div className={clsx(styles.content, noScroll && styles.noScroll)}>
        {children}
      </div>
    </Layout>
  );
};

export default PageLayout;
