package com.example.demo.config;

import java.util.Properties;

import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.context.annotation.Bean;

/**
 * Configures the native Hibernate SessionFactory used by the application.
 *
 * Hibernate XML mapping files are used instead of JPA annotations.
 *
 * The configuration connects Hibernate to the Spring-managed DataSource
 * and registers the Faculty and Student Hibernate mappings.
 */
@org.springframework.context.annotation.Configuration
public class HibernateConfig {

    /**
     * Creates the Hibernate SessionFactory.
     *
     * @param dataSource Spring-managed database DataSource
     * @return configured Hibernate SessionFactory
     */
    @Bean
    public SessionFactory sessionFactory(DataSource dataSource) {

        Properties properties = new Properties();

        // Use the Spring-managed DataSource for database connections.
        properties.put(
                "hibernate.connection.datasource",
                dataSource
        );

        // MySQL dialect used by the project.
        properties.put(
                "hibernate.dialect",
                "org.hibernate.dialect.MySQLDialect"
        );

        // Enable SQL output during development.
        properties.put("hibernate.show_sql", "true");
        properties.put("hibernate.format_sql", "true");

        // Schema is managed separately; Hibernate must not modify it.
        properties.put("hibernate.hbm2ddl.auto", "none");

        Configuration configuration = new Configuration();

        configuration.setProperties(properties);

        // Register native Hibernate XML mappings.
        configuration.addResource("Faculty.hbm.xml");
        configuration.addResource("Student.hbm.xml");

        return configuration.buildSessionFactory();
    }
}