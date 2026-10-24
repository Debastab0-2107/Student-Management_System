
package com.example.demo.config;

import java.util.Properties;

import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Configures the native Hibernate SessionFactory and Spring transaction
 * management for the Student Management System.
 *
 * Existing Hibernate XML mappings are retained.
 */
@org.springframework.context.annotation.Configuration
@EnableTransactionManagement
public class HibernateConfig {

    /**
     * Builds the Hibernate SessionFactory using the configured DataSource.
     */
    @Bean
    public SessionFactory sessionFactory(DataSource dataSource) {

        Properties properties = new Properties();

        properties.put("hibernate.connection.datasource", dataSource);
        properties.put(
                "hibernate.dialect",
                "org.hibernate.dialect.MySQLDialect"
        );
        properties.put("hibernate.show_sql", "true");
        properties.put("hibernate.format_sql", "true");
        properties.put("hibernate.hbm2ddl.auto", "none");

        Configuration configuration = new Configuration();
        configuration.setProperties(properties);

        // Existing Hibernate mapping resources.
        configuration.addResource("Faculty.hbm.xml");
        configuration.addResource("Student.hbm.xml");
        configuration.addResource("Subject.hbm.xml");
        configuration.addResource("Marks.hbm.xml");
        configuration.addResource("CAMarks.hbm.xml");

        return configuration.buildSessionFactory();
    }

    /**
     * Creates the Spring transaction manager for JDBC operations.
     */
    @Bean
    public PlatformTransactionManager transactionManager(
            DataSource dataSource) {

        return new DataSourceTransactionManager(dataSource);
    }
}
