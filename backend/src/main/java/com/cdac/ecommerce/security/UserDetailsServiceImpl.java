// MODIFIED: Package updated for e-commerce project
package com.cdac.ecommerce.security;

// MODIFIED: Updated entity and repository imports
import com.cdac.ecommerce.entity.User;
import com.cdac.ecommerce.repository.AuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    // MODIFIED: Used AuthRepository for finding user by email
    private final AuthRepository authRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // MODIFIED: Adapted to User entity and AuthRepository
        User user = authRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // MODIFIED: Updated status checks using User active and blocked fields
        if (!user.isActive()) {
            throw new DisabledException("User account is inactive.");
        }
        if (user.isBlocked()) {
            throw new LockedException("Your account has been blocked.");
        }

        return UserDetailsImpl.build(user);
    }
}

