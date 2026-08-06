package com.cdac.ecommerce.aspect;

import com.cdac.ecommerce.annotation.LogAdminAction;
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.security.UserDetailsImpl;
import com.cdac.ecommerce.service.AdminAuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AdminAuditAspect {

    private final AdminAuditLogService adminAuditLogService;
    private final ExpressionParser parser = new SpelExpressionParser();

    @AfterReturning(value = "@annotation(logAdminAction)", returning = "result")
    public void logAdminActivity(JoinPoint joinPoint, LogAdminAction logAdminAction, Object result){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !(authentication.isAuthenticated())){
            return;
        }

        User authenticatedAdmin = null;
        Object principal = authentication.getPrincipal();

        if(principal instanceof UserDetailsImpl userDetails){
            authenticatedAdmin = userDetails.getUser();
        } else if (principal instanceof User user) {
            authenticatedAdmin = user;
        }

        if(authenticatedAdmin == null){
            log.warn("AdminAuditAspect: Could not resolve User entity from principal.");
            return;
        }

        Long resolvedEntityId = resolveEntityId(joinPoint, logAdminAction.entityId(), result);

        String description = logAdminAction.description().isEmpty()
                ? String.format("Admin performed %s on %s (ID: %s)", logAdminAction.action(), logAdminAction.entity(), resolvedEntityId)
                : logAdminAction.description();

        adminAuditLogService.logAction(
                authenticatedAdmin,
                logAdminAction.action(),
                logAdminAction.entity(),
                resolvedEntityId,
                description
        );

    }

    private Long resolveEntityId(JoinPoint joinPoint, String expressionString, Object result) {
        if(expressionString == null || expressionString.isBlank()){
            return null;
        }

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String[] parameterNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();

        EvaluationContext context = new StandardEvaluationContext();

        if(parameterNames != null){
            for(int i = 0; i < parameterNames.length; i++){
                context.setVariable(parameterNames[i], args[i]);
            }
        }

        context.setVariable("result", result);

        try {
            Object val = parser.parseExpression(expressionString).getValue(context);
            if(val instanceof Number number){
                return number.longValue();
            }
        } catch (Exception e){

        }
        return null;
    }

}
