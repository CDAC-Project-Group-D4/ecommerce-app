package com.cdac.ecommerce.annotation;

import com.cdac.ecommerce.entity.enums.Action;
import com.cdac.ecommerce.entity.enums.EntityEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogAdminAction {

    Action action();
    EntityEnum entity();

    String entityId() default "";

    String description() default "";
}
